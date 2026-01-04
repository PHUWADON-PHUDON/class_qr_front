"use client";
import { useState,useEffect } from "react";
import { useZxing } from "react-zxing";

export default function Camera({studentcheck,setstudentcheck,checksuccess,setchecksuccess,setissave}:any) {
    const [device,setuseState] = useState<string>("");
    const [camera,setCarmera] = useState<number>(0)

    useEffect(() => {
        (async () => {
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(d => d.kind === "videoinput");
        
          if (videoDevices.length > 0) {
            const getcameranumber = localStorage.getItem("camera");
            if (getcameranumber) {
                setuseState(videoDevices[+getcameranumber].deviceId);
            }
            else {
                setuseState(videoDevices[camera].deviceId);
            }
            
          }
        })();
    },[camera]);

    //!handle camera

    const { ref } = useZxing({
        deviceId: device !== "" ? device : "NOCAMERA",
        onDecodeResult(result) {
            let success:any = {};
            const findstudent = studentcheck.map((e:any) => {
                if (e.student_id === result.getText()) {
                    e.checkid = 1;
                    success = e;

                    setissave(true);

                    return(e);
                }
                else {
                    return(e);
                }
            });

            const isrepeat = checksuccess.some((e:any) => e.studentid === success.studentid);
            
            if (Object.keys(success).length) {
                if (checksuccess.length > 0) {
                    if (!isrepeat) {
                        setchecksuccess([success,...checksuccess]);
                        const audio = new Audio('/beep.wav');
                        audio.play();
                    }
                }
                else if (checksuccess.length === 0) {
                    setchecksuccess([success,...checksuccess]);
                    const audio = new Audio('/beep.wav');
                    audio.play();
                }
            }

            setstudentcheck((prev:any) => [...findstudent]);
        }
    });

    //!

    return(
        <div className="fixed mt-[10px] h-[calc(100dvh_-_50px)] w-full bg-black/80 flex gap-[20px] z-[100]">
            <div>
                <video ref={ref} autoPlay className="w-[600px] h-[455px] border-2 border-gray-400 rounded-lg shadow-md"/>
                <div className="flex mt-[20px]">
                    <div onClick={() => {setCarmera(0); localStorage.setItem("camera","0")}} className="bg-white text-black mr-[20px] p-[2px_20px] rounded-2xl cursor-pointer">กล้อง 0</div>
                    <div onClick={() => {setCarmera(1); localStorage.setItem("camera","1")}} className="bg-white text-black mr-[20px] p-[2px_20px] rounded-2xl cursor-pointer">กล้อง 1</div>
                    <div onClick={() => {setCarmera(2); localStorage.setItem("camera","2")}} className="bg-white text-black mr-[20px] p-[2px_20px] rounded-2xl cursor-pointer">กล้อง 2</div>
                </div>
            </div>
            <div className="overflow-y-scroll w-[400px] p-[20px_0] grow-1">
                {checksuccess.map((e:any,i:number) => (
                    <p key={i}>{checksuccess.length - 1 - i + 1}. {e.name} {e.lastname}</p>
                ))}
            </div>
        </div>
    );
}