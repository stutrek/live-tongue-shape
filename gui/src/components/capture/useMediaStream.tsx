export {};
// import React from 'react';
// import { ModifierGenerator, useLocalStore } from '../../hooks/useLocalStore';

// type MediaStreamState = {
//     stream?: MediaStream;
//     Video?: JSX.Element;
//     getFrame?: (cb: (blob: Blob | null) => void) => void;
//     error?: Error;
// };

// const modifierGenerator: ModifierGenerator<MediaStreamState> = (
//     setState,
//     getState
// ) => ({
//     async prompt(state) {
//         try {
//             // @ts-ignore
//             const stream = await navigator.mediaDevices.getDisplayMedia({
//                 audio: false,
//                 video: true,
//             });
//             let videoEl: HTMLVideoElement | undefined;

//             const canvas = document.createElement('canvas');
//             let sizeSet = false;

//             const Video = (
//                 <video
//                     ref={(el) => {
//                         if (el) {
//                             el.srcObject = stream;
//                             el.play();
//                             videoEl = el;
//                             el.onplaying = () => {
//                                 setState({
//                                     getFrame: (
//                                         cb: (blob: Blob | null) => void
//                                     ) => {
//                                         if (
//                                             videoEl === undefined ||
//                                             videoEl.videoWidth === 0
//                                         ) {
//                                             cb(null);
//                                             return;
//                                         }
//                                         if (sizeSet === false) {
//                                             canvas.width = videoEl.videoWidth;
//                                             canvas.height = videoEl.videoHeight;
//                                             sizeSet = true;
//                                         }
//                                         const context = canvas.getContext('2d');
//                                         context?.drawImage(el, 0, 0);
//                                         canvas.toBlob(cb, 'image/jpeg');
//                                     },
//                                 });
//                             };
//                         }
//                     }}
//                     style={{ width: 500 }}
//                 />
//             );

//             return {
//                 stream,
//                 Video,
//                 error: undefined,
//             };
//         } catch (e) {
//             return {
//                 stream: undefined,
//                 Video: undefined,
//                 error: (e as unknown) as Error,
//             };
//         }
//     },
// });

// export const useMediaStream = () => {
//     return useLocalStore({}, modifierGenerator);
// };
