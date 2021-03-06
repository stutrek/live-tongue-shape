FROM tensorflow/tensorflow:1.14.0-gpu-py3

RUN curl -L https://github.com/lingjzhu/mtracker.github.io/archive/master.zip > master.zip
RUN unzip master.zip -d .
WORKDIR /mtracker.github.io-master

RUN pip install --upgrade pip

RUN pip install keras==2.2.5
RUN pip install scikit-image==0.14.3
RUN pip install Imageio
RUN pip install Praatio
RUN pip install tqdm 
RUN pip install scikit-learn
RUN pip install pandas
RUN pip install imageio-ffmpeg

COPY ./models ./models

# RUN python track_video.py -v ./demo/demo_video.mp4 -t du -m ./models/dense_aug.hdf5 -o ./demo/out.csv -f ./demo -n 5
# RUN cat ./demo/out.csv

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get -y install nodejs
# RUN apt-get -y install npm
RUN npm -g install yarn

EXPOSE 8088


COPY ./gui /gui
WORKDIR /gui
RUN yarn install
RUN yarn build

COPY ./server /server
WORKDIR /server
RUN yarn install
CMD ["yarn", "start"]