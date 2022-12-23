ARG VARIANT="focal"
# Microsoft が用意している devcontainers 用の Docker イメージを利用
# 今回は base:focal のタグを指定しているので、 Ubuntu 20.04 LTS の環境を利用します。
FROM mcr.microsoft.com/vscode/devcontainers/base:${VARIANT}


# apt のリポジトリを更新
RUN apt update && apt upgrade -y
# curl、git、gpg をインストール
RUN apt install curl git gnupg2

# Node.js v18 のインストール
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | \
	sudo -E bash - && \
	apt install -y nodejs

# 今回は Node.js のパッケージマネージャに yarn を用いるので、 yarn を有効化
RUN corepack enable yarn && \
	corepack prepare yarn@stable --activate