import os
import subprocess
from threading import Thread


Thread(os.system("venv\\Scripts\\activate && flask --app backend/api run")).start() # start backend server (Flask)
subprocess.run("npm start --prefix frontend", capture_output=True, shell=True)      # start frontend server (React)