from webbrowser import open_new_tab
from os.path import realpath

import os 

# open frontend in new tab and start api server
if __name__ == "__main__":
    open_new_tab('file://' + realpath('./frontend/build/index.html'))
    os.system("cd ./backend && python starter.py")      