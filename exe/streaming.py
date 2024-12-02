import cv2
from mjpeg_streamer import MjpegServer, Stream
import time
from threading import Timer
from aiohttp.web_runner import GracefulExit
import socket

class StreamController:
    def __init__(self):
        self.cap = None
        self.stream = None
        self.server = None
        self.is_streaming = False
        self.no_client_timeout = 30  # Tempo de espera para encerrar caso não haja clientes conectados
        self.timer = None
        self.client_count = 0  # Contador de clientes conectados

    def _get_local_ip(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
        finally:
            s.close()
        return ip

    def _stop_stream_due_to_inactivity(self):
        print("Verificando clientes antes de encerrar o stream por inatividade...")
        if self.client_count == 0:
            print("Nenhum cliente conectado. Encerrando o stream por inatividade.")
            self.stop_stream()
        else:
            print(f"Clientes conectados: {self.client_count}. Stream continua ativo.")
            self._reset_timer()

    def _reset_timer(self):
        if self.timer:
            print("Resetando o timer de inatividade.")
            self.timer.cancel()
        else:
            print("Iniciando o timer de inatividade pela primeira vez.")

        self.timer = Timer(self.no_client_timeout, self._stop_stream_due_to_inactivity)
        self.timer.start()

    def _on_new_client(self):
        self.client_count += 1
        print(f"Novo cliente conectado. Total de clientes: {self.client_count}")
        self._reset_timer()

    def _on_client_disconnect(self):
        self.client_count = max(0, self.client_count - 1)
        print(f"Cliente desconectado. Total de clientes: {self.client_count}")
        self._reset_timer()

    def start_stream(self):
        if self.is_streaming:
            print("Stream já está em execução.")
            return

        self.cap = cv2.VideoCapture(0)
        self.stream = Stream("my_camera", size=(416, 416), quality=60, fps=24)

        local_ip = self._get_local_ip()
        print(f"Iniciando o servidor de stream em {local_ip}:8080")
        self.server = MjpegServer(local_ip, 8080)
        
        self.server.add_stream(self.stream)
        self.server.on_new_client_callback = self._on_new_client
        self.server.on_client_disconnect_callback = self._on_client_disconnect
        self.server.start()
        self.is_streaming = True

        print("Stream iniciado.")

        self._reset_timer()

        while self.is_streaming:
            ret, frame = self.cap.read()
            if not ret:
                break

            self.stream.set_frame(frame)
            time.sleep(1 / 24)

    def stop_stream(self):
        if not self.is_streaming:
            print("Stream não está em execução.")
            return

        self.is_streaming = False
        try:
            print("Tentando parar o servidor...")
            self.server.stop()
        except GracefulExit:
            print("Servidor encerrado com GracefulExit.")
        finally:
            self.cap.release()

        if self.timer:
            self.timer.cancel()

        print("Stream parado.")


stream_controller = StreamController()

if __name__ == "__main__":
    stream_controller.start_stream()
