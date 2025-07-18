from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

nuevo_hash = bcrypt.generate_password_hash("vakita123").decode('utf-8')
print(nuevo_hash)
