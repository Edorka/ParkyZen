from node import Node
from node.server import app, NodeServerHandler
from api.server import may_fail, InvalidResource, ResourceNotFound
from block import Block, GenesisBlock
from crypto import sha_of, load_publickey
from os import environ


data = {
    'description': 'Park slots near Oeste-1 building',
    'geoposition': [1.23, 4.45]
}

genesis_block = GenesisBlock(data)

_plate_not_found = 'Plate not registered: {}'


class ParkyzenNodeServerHandler(NodeServerHandler):

    @app.when_get('/users')
    @may_fail
    def retrieve_user(self, params=None):
        plates = params.get('plate', [])
        plate = plates[0] if len(plates) > 0 else None
        if plate is None:
            raise InvalidResource('No plate provided')
        register = self.server.find_user(plate)
        return 200, {'register': register}

    @app.when_post('/users/me')
    @may_fail
    def register_me(self, params=None):
        plate = params.get('plate')
        key = params.get('pub_key')
        is_new = self.server.new_user(plate, key)
        return 201 if is_new else 200, {'message': 'welcome'}

    @app.when_get('/messages')
    @may_fail
    def list_messages(self, params=None):
        plates = params.get('plate', [])
        plate = plates[0] if len(plates) > 0 else None
        from_index = params.get('from_index', 0)
        items = self.server.messages_for(plate, from_index=from_index)
        return 200, {'items': items}

    @app.when_post('/messages')
    @may_fail
    def new_message(self, params=None):
        print('new message', params)
        plate = params.get('plate')
        recipient = params.get('to')
        recipient = recipient if len(recipient) > 0 else None
        content = params.get('content')
        signature = params.get('signature')
        done = self.server.new_message(plate, content,
                                       recipient=recipient,
                                       signature=signature)
        return 200, {'sent': done.index}


def find(fields, source):
    target = source
    for field in fields.split('.'):
        target = target.get(field)
        if target is None:
            break
    else:
        return target
    return None


class ParkyzenNode(Node):

    def insert_data(self, data):
        last_block = self.chain[-1]
        index = last_block.index + 1
        previous_hash = last_block.hash
        new_block = Block(index, previous_hash, data)
        self.add_block(new_block, report=True)
        return new_block

    def find_user(self, plate):
        for block in self.chain:
            register = block.data.get('registered')
            if register is not None:
                if plate == register.get('plate'):
                    return register
        raise ResourceNotFound(_plate_not_found.format(plate))

    def new_message(self, sender, content, recipient=None, signature=None):
        sender_register = self.find_user(sender)
        if sender_register is None:
            raise ResourceNotFound(_plate_not_found.format(sender))
        pub_key = load_publickey(sender_register.get('pub_key'))
        content_hash = sha_of(content)
        # print('signature', signature)
        # print('content_hash', content_hash)
        if recipient is not None and self.find_user(recipient) is None:
            raise ResourceNotFound(_plate_not_found.format(recipient))
        message = {
            'sender': sender,
            'content': content,
            'rcpt': recipient,
            'sign': signature
        }
        return self.insert_data({'message': message})

    def messages_for(self, plate, from_index=0):
        items = []
        for block in reversed(self.chain):
            message = block.data.get('message')
            if message is None:
                continue
            recipient = message.get('rcpt')
            if recipient is not None and recipient != plate:
                continue
            public = True if recipient is None else False
            items.append({
                'index': block.index,
                'public': public,
                'sent': block.timestamp,
                'from': message.get('sender'),
                'message': message.get('content')
            })
        return items

    def new_user(self, plate, key):
        is_new = False
        previous_user = self.find_user(plate)
        if previous_user is not None:
            if previous_user.get('pub_key') != key:
                raise InvalidResource('{} already registered'.format(plate))
        else:
            data = {
                'registered': {
                    'plate': plate,
                    'pub_key': key
                }
            }
            self.insert_data(data)
            is_new = True
        return is_new


try:
    port = int(environ.get('PORT', None))
except TypeError:
    port = 8080

print('genesis b', genesis_block)
ParkyzenNode(port=port, genesis_block=genesis_block).serve()
