{pkgs}: {
  deps = [
    pkgs.nvidia-podman
    pkgs.wget
    pkgs.systemdStage1Network
    pkgs.systemd
    pkgs.docker-compose_1
   ];
}
