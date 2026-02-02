import bcrypt

password = "testpassword123"
print(f"Hashing password: '{password}'")

pwd_bytes = password.encode('utf-8')
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(pwd_bytes, salt)
print(f"Hashed: {hashed}")

# Verify
match = bcrypt.checkpw(pwd_bytes, hashed)
print(f"Match: {match}")

if match:
    print("Success!")
else:
    print("Verification failed!")
