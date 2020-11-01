# Live Tongue Shape

This is an experiment to get a live tracing of the surface of the tongue from an ultrasound video. To use it a live or prerecorded ultrasound video must be visible in a window on your computer.

The system consists of:

-   [a Python powered CNN by Jian Zhu](https://github.com/lingjzhu/mtracker.github.io/)
-   a nodejs server that receives an image, processes it, and return the result
-   a web app that lets you capture a window containing the ultrasound (like sharing a window in a video chat), and sends frames to the back end.

## Usage

Since the CNN involves tensorflow and other libraries that are very picky about version numbers, it runs in a docker container.

1.  Install Docker if you haven't already
2.  Download the CNN models linked from the readme of Jian Zhu's repo and put them in a folder called `models` at the root of this repo.
3.  In this repo run these commands:
    -   `docker build . -t tongue -f ./Dockerfile` - this will build the docker image
    -   `docker run -d -p 8088:8088 tongue`
4.  Visit http://localhost:8088 in a web browser
5.  Press the "Get window" button (it's the only button) and select a window containing ultrasound.

## Current Status

The current server side implementation performs these actions:

1. receive image from socket
2. save to disk
3. run the python command to analyze it
4. read the result from disk
5. send the result over the socket

Currently, on a high powered MacBook Pro, this takes about 30 seconds, which is far too long. As part of this process, it has to initialize the CNN for every image. If instead the python process could continue running and either receive an image (or a path to one) from stdin, the system could be much faster.
