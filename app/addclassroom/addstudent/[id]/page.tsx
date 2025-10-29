"use client";
import { useState,useEffect, use } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface lavelType {
    id:number;
    lavel:number;
    sublavel:number;
}

interface studentType {
    id:number;
    lavelid:string
    studentid:string;
    name:string;
    lastname:string;
    lavel:{lavel:number,sublavel:number};
}

export default function Addstudent() {
    const [handlelavel,sethandlelavel] = useState<lavelType>({id:0,lavel:0,sublavel:0});
    const [getstudentid,setgetstudentid] = useState<string>("");
    const [getstudentname,setgetstudentname] = useState<string>("");
    const [getstudentlastname,setgetstudentlastname] = useState<string>("");
    const [handlestudent,sethandlestudent] = useState<studentType[]>([]);
    const param = useParams();
    const url = "http://localhost:3000";

    //!load data

    const loadData = async () => {
        try{
            const res = await axios.get(url + "/lavel/getlavel/" + param.id);
            if (res.status === 200) {
                sethandlelavel({id:res.data.id,lavel:res.data.lavel,sublavel:res.data.sublavel});

                const res2 = await axios.get(url + "/lavel/getallstudent/" + param.id);
                if (res2.status === 200) {
                    sethandlestudent([...res2.data]);
                }
            }
        }
        catch(err) {}
    }

    useEffect(() => {
        loadData();
    },[]);

    //!

    //!handle submit

    const handleSubmit = async () => {
        try{
            if (getstudentid !== "" && getstudentname !== "" && getstudentlastname !== "") {
                const res = await axios.post(url + "/lavel/createstudent",{lavelid:param.id,studentid:getstudentid,name:getstudentname,lastname:getstudentlastname});
                if (res.status === 201) {
                    if (!res.data.hasdata) {
                        sethandlestudent([...handlestudent,res.data.data]);
                    }
                }
            }
        }
        catch(err) {}
    }

    //!

    //!handle delete

    const deleteStudent = async (text:string,studentid:number) => {
        try{
            const isconfirm = confirm(`ต้องการลบ ${text} ใช่หรือไม่`);
            if (isconfirm) {
                const res = await axios.delete(url + "/lavel/deletestudent/" + studentid);
                if (res.status === 200) {
                    loadData();
                }       
            }
        }
        catch(err) {}
    }

    //!

    return(
        <div className="flex flex-col h-[90dvh]">
            <div className="h-[180px]">
                <p className="text-center text-[20px] font-bold">ชั้น ม.{handlelavel.lavel}/{handlelavel.sublavel}</p>
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
                    <p>เพิ่ม</p>
                </div>
            </div>
            <div className="grow-[1] p-[20px] overflow-y-scroll">
                <div className="grid grid-cols-6 text-center font-bold">
                    <p>ลำดับ</p>
                    <p>ชั้น</p>
                    <p>รหัสนักเรียน</p>
                    <p>ชื่อ</p>
                    <p>นามสกุล</p>
                    <p>Option</p>
                </div>
                {handlestudent.slice().reverse().map((e,i) => (
                    <div key={i} className="grid grid-cols-6 text-center border-t border-gray-600 p-[5px_0]">
                        <p>{handlestudent.length - 1 - i + 1}</p>
                        <p>ม.{e.lavel.lavel}/{e.lavel.sublavel}</p>
                        <p>{e.studentid}</p>
                        <p>{e.name}</p>
                        <p>{e.lastname}</p>
                        <div className="flex justify-center gap-[10px]">
                            <Link href={`/addclassroom/addstudent/${param.id}/editstudent/${e.id}`}>แก้ไข</Link>
                            <div onClick={() => deleteStudent(e.name,e.id)} className="cursor-pointer">ลบ</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}