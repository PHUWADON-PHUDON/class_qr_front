"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import axios from "axios";

interface lavelType {
    id:number;
    lavel:number;
    sublavel:number;
}

interface subjectType {
    id:number;
    subjectname:string;
    lavel_id:number;
    lavel:{id:number,lavel:number,sublavel:number}
}

export default function Addsubjectroom() {
    const [handlelavel,sethandlelavel] = useState<lavelType[]>([]);
    const [getsubject,setgetsubject] = useState<string>("");
    const [getlavel,setgetlavel] = useState<number>(0);
    const [handlesubject,sethandlesubject] = useState<subjectType[]>([]);
    const url = "http://localhost:3000";

    //!load data

    useEffect(() => {
        const loadData = async () => {
            try{
                const res = await axios.get(url + "/lavel/");
                if (res.status === 200) {
                    sethandlelavel(res.data);

                    const res2 = await axios.get(url + "/subject/getallsubject");
                    if (res2.status === 200) {
                        sethandlesubject([...res2.data]);
                    }
                }
            }
            catch(err) {}
        }

        loadData();
    },[]);

    //!

    //!handle submit

    const handleSubmit = async () => {
        try{
            if (getsubject !== "" && getlavel !== 0) {
                const res = await axios.post(url + "/subject/createsubject",{subjectname:getsubject,lavel:getlavel});
                if (res.status === 201) {
                    if (!res.data.hasdata) {
                        sethandlesubject([...handlesubject,res.data.data]);
                    }
                }
            }
        }
        catch(err) {
            console.error(err);
        }
    }

    //!

    //!delete subject

    const deleteSubject = async (id:number,subjectname:string,level:string) => {
        const isconfirm = confirm(`ต้องการลบวิชา ${subjectname} ชั้น ม.${level} ใช่หรือไม่`);
        if (isconfirm) {
            const res = await axios.delete(url + "/subject/deletesubject/" + id);
            window.location.reload();
        }
    }

    //!

    return(
        <div>
            <div className="flex items-center gap-[10px] text-[20px]">
                <p>เพิ่มวิชา</p>
                <input onChange={(e) => setgetsubject(e.target.value)} className="bg-white rounded-2xl h-[30px] pl-[10px] text-[#000] focus:outline-none" type="text" />
                <p>ชั้น ม.</p>
                <select onChange={(e) => setgetlavel(parseInt(e.target.value))} className="bg-[#000]">
                    <option value={0}>เลือก</option>
                    {handlelavel.map((e,i) => (
                        <option key={i} value={e.id}>{e.lavel}/{e.sublavel}</option>
                    ))}
                </select>
                <div onClick={() => handleSubmit()} className="bg-white p-[2px_1rem] rounded-2xl text-[#000] cursor-pointer">
                    <p>เพิ่ม</p>
                </div>
            </div>
            <div className="mt-[30px] flex gap-[20px] flex-wrap">
                {handlesubject.map((e,i) => (
                    <div key={i} className="relative bg-white rounded-2xl w-[200px]">
                        <Link href={`/addsubjectroom/studentsubject/${e.id}`} key={i} className="text-[#000] cursor-pointer">
                            <p className="text-center text-[20px]">{e.subjectname}</p>
                            <p className="text-center text-[20px]">ม.{e.lavel.lavel}/{e.lavel.sublavel}</p>
                        </Link>
                        <div onClick={() => deleteSubject(e.id,e.subjectname,`${e.lavel.lavel}/${e.lavel.sublavel}`)} className="absolute right-[-10px] top-[-10px] bg-[red] flex justify-center items-center text-[#fff] w-[25px] h-[25px] rounded-[100%] cursor-pointer">ลบ</div>
                    </div>
                ))}
            </div>
        </div>
    );
}