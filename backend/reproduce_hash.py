from passlib.context import CryptContext
import sys

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    password = "testpassword123"
    print(f"Hashing password: '{password}'")
    hashed = pwd_context.hash(password)
    print(f"Success: {hashed}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
