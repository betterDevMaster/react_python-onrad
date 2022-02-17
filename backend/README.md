1. install python 3.8.5 in you PC
2. git clone https://NiceToMeetYou0321@bitbucket.org/NiceToMeetYou0321/dicom-server.git
3. cd dicom-server
4. run as the following
    $ python3 -m venv .env
    $ source ./.env/bin/activate
    $ pip3 install -r requirements.txt
    $ python3 ./src/server.py
    
5. Open your program and send images with port 11112.
   * you can set port in setting.json