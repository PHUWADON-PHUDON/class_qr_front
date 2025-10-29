"use client";
import { useState,useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface lavelType {
    id:number;
    lavel:number;
    sublavel:number;
}

export default function Addclassroom() {
    const [getlavel,setgetlavel] = useState<number>(1);
    const [getsublavel,setgetsublavel] = useState<number>(1);
    const [handleclassroom,sethandleclassroom] = useState<lavelType[]>([]);
    const lavelarr = [1,2,3,4,5,6];
    const sublavel = [1,2,3,4,5,6,7,8,9,10,11,11,12,13,14,15];
    const url = "http://localhost:3000";

    //!load data

    useEffect(() => {
        const loadData = async () => {
            const res = await axios.get(url + "/lavel/");
            if (res.status === 200) {
                sethandleclassroom([...res.data]);
            }
        }

        loadData();
    },[]);

    //!

    //!create classroom

    const handleSubmit = async () => {
        try{
            const res = await axios.post(url + "/lavel/createclassroom",{lavel:getlavel,sublavel:getsublavel});
            if (res.status === 201) {
                if (!res.data.hadata) {
                    sethandleclassroom([...handleclassroom,res.data.data]);
                }
            }
        }
        catch(err) {}
    }

    //!

    return(
        <div>
            <div className="flex gap-[10px] text-[20px]">
                <p>เพิ่มชั้น ม.</p>
                <select onChange={(e:any) => setgetlavel(parseInt(e.target.value))} value={getlavel} className="bg-[#000]">
                    {lavelarr.map((e,i) => (
                        <option key={i} value={e}>{e}</option>
                    ))} 
                </select>
                <p> / </p>
                <select onChange={(e:any) => setgetsublavel(parseInt(e.target.value))} value={getsublavel} className="bg-[#000]">
                    {sublavel.map((e,i) => (
                        <option key={i} value={e}>{e}</option>
                    ))} 
                </select>
                <div onClick={() => handleSubmit()} className="bg-white p-[2px_1rem] rounded-2xl text-[#000] cursor-pointer">
                    <p>เพิ่ม</p>
                </div>
            </div>
            <div className="mt-[30px] flex flex-wrap gap-[20px]">
                {handleclassroom.map((e,i) => (
                    <Link href={`/addclassroom/addstudent/${e.id}`} key={i} className="w-[150px] h-[120px] bg-white rounded-2xl flex justify-center items-center text-[#000] text-[30px] cursor-pointer">
                        <p>ชั้น ม.{e.lavel}/{e.sublavel}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}