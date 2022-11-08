package main

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"strings"
)

func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return ""
}

func main() {

	fmt.Printf("[[ --> MOBILE URL: %s:%s <-- ]]\n", GetLocalIP(), "3000")

	dir := strings.Split(os.Args[0], "/up")[0]

	cmd := exec.Command("bash", "-c", "docker-compose up --build")
	os.Chdir(dir)

	cmd.Stdout = os.Stdout
	err := cmd.Run()
	if err != nil {
		panic(err)
	}

	cmd2 := exec.Command("echo", "y", "|", "docker image prune")
	os.Chdir(dir)

	cmd2.Stdout = os.Stdout
	err = cmd.Run()
	if err != nil {
		panic(err)
	}
}
