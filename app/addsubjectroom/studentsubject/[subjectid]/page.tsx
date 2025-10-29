"use client";
import { useState,useEffect,useRef } from "react";
import { useParams } from "next/navigation";
import { useQRCode } from 'next-qrcode';
import { toPng } from "html-to-image";
import axios from "axios";

interface subjectType {
    id:number;
    subjectname:string;
    lavel_id:number;
    lavel:{id:number,lavel:number,sublavel:number}
}

interface studentType {
    id:number;
    lavelid:string
    studentid:string;
    name:string;
    lastname:string;
    lavel:{lavel:number,sublavel:number};
}

export default function Studentsubject() {
    const [handlesubjectname,sethandlesubjectname] = useState<subjectType>({id:0,subjectname:"",lavel_id:0,lavel:{id:0,lavel:0,sublavel:0}});
    const [handlestudent,sethandlestudent] = useState<studentType[]>([]);
    const [handlesvg,sethandlesvg] = useState<any>(null);
    const [isclickqrcode,setisclickqrcode] = useState<boolean>(false);
    const [qrdata,setqrdata] = useState<any>(null);
    const [nameqrdata,setnameqrdata] = useState<string>("");
    const qrelement = useRef<any>(null);
    const nameelement = useRef<any>(null);
    const downloadelement = useRef<any>(null);
    const param = useParams();
    const { Image } = useQRCode();
    const url = "http://localhost:3000";

    //!load data

    useEffect(() => {
        const loadData = async () => {
            const res = await axios.get(url + "/subject/getonesubject/" + param.subjectid);
            if (res.status === 200) {
                sethandlesubjectname(res.data);
                
                const res2 = await axios.get(url + "/subject/getstudentsubject/" + res.data.lavel.id);
                if (res2.status === 200) {
                    sethandlestudent(res2.data);
                }
            }
        }

        loadData();
    },[]);

    //!

    //!generate qr code

    const generate = (studentid:string,name:string) => {
        return(
            <div onClick={(e) => clickQrCode(e.target,name)} className="popup flex justify-center bg-[red] w-[100px]">
                <Image
                    text={`${studentid}`}
                    options={{
                      margin: 2,
                      width: 100,
                      color: {
                        dark: '#000',
                      },
                    }}
                />
            </div>
        );
    }

    //!

    //!click qr code

    useEffect(() => {
        const clickClose = (e:any) => {
            if (!e.target.className.includes("popup")) {
                setisclickqrcode(false);
            }
        }

        window.document.addEventListener("click",clickClose);

        return () => window.document.removeEventListener("click",clickClose);
    },[]);

    const clickQrCode = (e:any,name:string) => {
        setisclickqrcode(true);
        setqrdata(e);
        setnameqrdata(name);
        e.className = "popup";
    }

    useEffect(() => {
         if (qrelement && nameelement && isclickqrcode) {
            const clone =  qrdata.cloneNode(true);
            clone.style.width = "250px";

            qrelement.current.replaceChildren();
            qrelement.current.appendChild(clone);
        
            nameelement.current.innerHTML = "";
            nameelement.current.innerHTML = nameqrdata;
        }
    },[isclickqrcode,nameqrdata,qrdata]);

    //!

    //!download qr code

    const handleDowload = async () => {
        const download = downloadelement.current;

        if (!download) return;
        
        const dataUrl = await toPng(download);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${nameqrdata}_qrcode.png`;
        link.click();
    }

    return(
        <div>
            {isclickqrcode ? 
                <div className="popup absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#fff] w-[400px] h-[400px] rounded-2xl flex flex-col justify-center items-center">
                    <div ref={downloadelement} className="popup bg-white">
                        <div ref={qrelement} className="popup"></div>
                        <p ref={nameelement} className="popup text-[#000] text-[20px] font-bold text-center"></p>
                    </div>
                    <div onClick={() => handleDowload()} className="popup text-[#000] mt-[20px] cursor-pointer">Download</div>
                </div>
                :
                <p></p>
            }
            <div>
                <p className="text-[20px]">วิชา {handlesubjectname.subjectname} ม.{handlesubjectname.lavel.lavel}/{handlesubjectname.lavel.sublavel}</p>
            </div>
            <div className="h-[calc(90dvh_-_30px)] mt-[20px] overflow-y-scroll">
                <div className="grid grid-cols-5 text-center font-bold">
                    <p>ลำดับ</p>
                    <p>รหัสนักเรียน</p>
                    <p>ชื่อ</p>
                    <p>นามสกุล</p>
                    <p>QR Code</p>
                </div>
                {handlestudent.slice().reverse().map((e,i) => (
                    <div key={i} className="grid grid-cols-5 text-center text-[20px] mt-[10px] items-center justify-items-center">
                        <p>{handlestudent.length - 1 - i + 1}</p>
                        <p>{e.studentid}</p>
                        <p>{e.name}</p>
                        <p>{e.lastname}</p>
                        {generate(e.studentid,e.name)}
                    </div>
                ))}
            </div>
        </div>
    );
}