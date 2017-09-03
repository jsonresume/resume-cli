FROM node:8-alpine
RUN mkdir /data && \
	apk --no-cache add git && \
	npm install phantomjs-prebuilt@2.1.13 && \
	npm install -g resume-cli && \
	npm install -g jsonresume-theme-morki
WORKDIR /data
CMD bash