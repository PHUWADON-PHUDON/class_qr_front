"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Header from "../components/Header";

interface subjectType {
    id:number;
    subjectname:string;
    lavel_id:number;
    lavel:{id:number,lavel:number,sublavel:number}
}

export default function Home() {
  const [handlesubject,sethandlesubject] = useState<subjectType[]>([]);
  const url = "http://localhost:3000";

  //!load data

  useEffect(() => {
    const loadData = async () => {
      try{
        const res2 = await axios.get(url + "/subject/getallsubject");
        if (res2.status === 200) {
            sethandlesubject([...res2.data]);
        }
      }
      catch(err) {}
    }

    loadData();
  },[]);

  //!

  return (
    <div>
      <Header/>
      <div className="mt-[30px] flex gap-[20px] flex-wrap">
        {handlesubject.map((e,i) => (
            <Link href={`/studentcheck/${e.id}`} key={i} className="bg-white w-[200px] rounded-2xl text-[#000] cursor-pointer">
                <p className="text-center text-[20px]">{e.subjectname}</p>
                <p className="text-center text-[20px]">ม.{e.lavel.lavel}/{e.lavel.sublavel}</p>
            </Link>
        ))}
      </div>
    </div>
  );
}
