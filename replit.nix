{pkgs}: {
  deps = [
    pkgs.systemdStage1Network
    pkgs.systemd
    pkgs.docker-compose_1
   ];
}
