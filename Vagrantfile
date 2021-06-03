# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<-SCRIPT
echo I am provisioning...
date > /etc/vagrant_provisioned_at
runuser -l vagrant -c 'curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash'
echo 'export NVM_DIR="/home/vagrant/.nvm"' >> /home/vagrant/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> /home/vagrant/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion' >> /home/vagrant/.bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> /home/vagrant/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> /home/vagrant/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion' >> /home/vagrant/.bashrc
echo 'npm update npm  # This updates NPM on every login' >> /home/vagrant/.bashrc
runuser -l vagrant -c ' source /home/vagrant/.bashrc'
runuser -l vagrant -c 'export NVM_DIR="/home/vagrant/.nvm"'
runuser -l vagrant -c '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm'
runuser -l vagrant -c '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion'
runuser -l vagrant -c ' source ~/.bashrc'
runuser -l vagrant -c 'command -v nvm'
echo "INSTALLING NVM, NPM, AND RESUME-CLI ALL AT ONCE"
runuser -l vagrant -c 'source ~/.nvm/nvm.sh && nvm install node && npm install npm@latest -g && npm install -g resume-cli && npm -v'
runuser -l vagrant -c 'source ~/.nvm/nvm.sh && npm install jsonresume-theme-stackoverflow && npm install'\
'jsonresume-theme-flat && npm install jsonresume-theme-clean && npm install jsonresume-theme-modern && npm install jsonresume-theme-printclassy && npm -v'
echo "## Make the welcome message"
bash -c "cat >/home/vagrant/.welcometext.sh" << EOF
echo "                                      _
                                     (_)
 _ __ ___  ___ _   _ _ __ ___   ___   _ ___  ___  _ __
| '__/ _ \\\/ __| | | | '_ ' _ \\ / _ \\ | / __|/ _ \\| \'_ \\  
| | |  __/\\__ \\ |_| | | | | | |  __/_| \\__ \\ (_) | | | |
|_|  \\___||___/\\__,_|_| |_| |_|\\___(_) |___/\\___/|_| |_|
                                    _/ |
                                   |__/                 "
echo ""
echo ""
echo "usage guide: https://github.com/jsonresume/resume-cli#usage"
echo "resume validate"
echo "resume export --format pdf resume-$(date +"%m-%d-%y").pdf"
echo "resume export --format html resume-$(date +"%m-%d-%y").html"
echo "resume export --format html --theme stackoverflow resume-$(date +"%m-%d-%y").html"
echo "resume export --format html --theme slick resume-$(date +"%m-%d-%y").html"
echo "Or, if you like you can run the command 'resume' on its own, to see usage."
EOF
cat .welcometext.sh
echo "bash ~/.welcometext.sh" >> /home/vagrant/.bashrc
echo "usage guide: https://github.com/jsonresume/resume-cli#usage"
echo "resume validate"
echo "resume export --format pdf resume-$(date +"%m-%d-%y").pdf"
echo "resume export --format html resume-$(date +"%m-%d-%y").html"
echo "resume export --format html --theme stackoverflow resume-$(date +"%m-%d-%y").html"
echo "resume export --format html --theme slick resume-$(date +"%m-%d-%y").html"
echo ""
echo "Or, to see usage, run the command 'resume' after you run 'vagrant ssh' to log in to the Vagrant box."
SCRIPT


# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "bento/ubuntu-20.04"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Ansible, Chef, Docker, Puppet and Salt are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
  config.vm.provision "shell", inline: $script
end
