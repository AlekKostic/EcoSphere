import docker
from flask import Flask
import threading

app = Flask(__name__)

@app.route("/")
def health_check():
    return 'OK', 200

def run_mysql():
    client = docker.from_env()

    client.containers.run(
        "mysql:8.0",
        enviroment={"MYSQL_ROOT_PASSWORD" : "root", "MYSQL_DATABASE" : "mts_app_konkurs"},
        ports = {'3306':'3306'},
        detach = True
    )

    def run_flask_app():
        app.run(host='0.0.0.0', port=1000)

    def main():
        threading.Thread(target = run_mysql).start()

        run_flask_app()

    if __name__ == "__main__":
        main()