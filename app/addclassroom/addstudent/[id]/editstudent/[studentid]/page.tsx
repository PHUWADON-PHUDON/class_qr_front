"use client";
import { useState,useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Editstudent() {
    const [getstudentid,setgetstudentid] = useState<string>("");
    const [getstudentname,setgetstudentname] = useState<string>("");
    const [getstudentlastname,setgetstudentlastname] = useState<string>("");
    const param = useParams();
    const url = "http://localhost:3000";

    //!load data

    useEffect(() => {
        const loadData = async () => {
            const res = await axios.get(url + "/lavel/getonestudent/" + param.studentid);
            if (res.status === 200) {
                setgetstudentid(res.data.studentid);
                setgetstudentname(res.data.name);
                setgetstudentlastname(res.data.lastname);
            }
        }

        loadData();
    },[]);

    //!

    //!handle submit

    const handleSubmit = async () => {
        try{
            if (getstudentid !== "" && getstudentname !== "" && getstudentlastname !== "") {
                const res = await axios.patch(url + "/lavel/updatestudent/" + param.studentid,{studentid:getstudentid,name:getstudentname,lastname:getstudentlastname});
                if (res.status === 200) {
                    setgetstudentid(res.data.studentid);
                    setgetstudentname(res.data.name);
                    setgetstudentlastname(res.data.lastname);
                }
            }
        }
        catch(err) {}
    }

    //!

    return(
        <div>
            <div className="h-[180px]">
                <div className="flex justify-center">
                    <div>
                        <p className="mt-[5px] text-[20px]">รหัสนักเรียน:</p>
                        <p className="mt-[5px] text-[20px]">ชื่อ:</p>
                        <p className="mt-[5px] text-[20px]">นามสกุล</p>
                    </div>
                    <div className="pl-[20px]">
                        <input onChange={(e) => /^[0-9]*$/.test(e.target.value) ? setgetstudentid(e.target.value):""} value={getstudentid} className="bg-white block mt-[5px] h-[30px] rounded-2xl w-[300px] pl-[10px] text-[#000] focus:outline-none" type="text" />
                        <input onChange={(e) => setgetstudentname(e.target.value)} value={getstudentname} className="bg-white block mt-[5px] h-[30px] rounded-2xl w-[300px] pl-[10px] text-[#000] focus:outline-none" type="text" />
                        <input onChange={(e) => setgetstudentlastname(e.target.value)} value={getstudentlastname} className="bg-white block mt-[5px] h-[30px] rounded-2xl w-[300px] pl-[10px] text-[#000] focus:outline-none" type="text" />
                    </div>
                </div>
                <div onClick={() => handleSubmit()} className="bg-white m-[10px_auto] p-[2px_1rem] rounded-2xl text-[#000] cursor-pointer w-[65px]">
                    <p>แก้ไข</p>
                </div>
            </div>
        </div>
    );
}