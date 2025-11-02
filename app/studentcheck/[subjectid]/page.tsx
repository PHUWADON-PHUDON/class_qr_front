"use client";
import { useState,useEffect,useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import moment from "moment";
import Camera from "@/components/Camera";

interface studentType {
    id:number;
    lavelid:string
    studentid:string;
    name:string;
    lastname:string;
    lavel:{lavel:number,sublavel:number};
}

interface subjectType {
    id:number;
    subjectname:string;
    lavel_id:number;
    lavel:{id:number,lavel:number,sublavel:number}
}

interface lavelType {
    id:number;
    lavel:number;
    sublavel:number;
}

interface studentCheckType {
    name:string;
    lastname:string;
    student_id:string;
    studentid:number;
    lavelid:number;
    subjectid:number;
    checkid:number;
}

interface checkStatusType {
    id:number;
    statusname:string;
}

export default function Studentcheck() {
    const [handlesubjectname,sethandlesubjectname] = useState<subjectType>({id:0,subjectname:"",lavel_id:0,lavel:{id:0,lavel:0,sublavel:0}});
    const [handlelavel,sethandlelavel] = useState<lavelType>({id:0,lavel:0,sublavel:0});
    const [handlestudent,sethandlestudent] = useState<studentType[]>([]);
    const [datenow,setdatenow] = useState<any>();
    const [studentcheck,setstudentcheck] = useState<studentCheckType[]>([]);
    const [handlecheckstatus,sethandlecheckstatus] = useState<checkStatusType[]>([]);
    const [isopencamera,setisopencamera] = useState<boolean>(false);
    const [issave,setissave] = useState<boolean>(false);
    const [checksuccess,setchecksuccess] = useState<studentCheckType[]>([]);
    const [handlehistory,sethandlehistory] = useState<any>([]);
    const [iscansave,setiscansave] = useState<boolean>(false);
    const param = useParams();
    const url = "http://localhost:3000";

    //!load data

    useEffect(() => {
        const loadData = async () => {
            try{
                setdatenow(moment().format("DD-MM-YYYY"));
                const res = await axios.get(url + "/subject/getonesubject/" + param.subjectid);
                if (res.status === 200) {
                    sethandlesubjectname(res.data);

                    const res2 = await axios.get(url + "/lavel/getlavel/" + res.data.lavel_id);
                    if (res2.status === 200) {
                        sethandlelavel(res2.data);
                    }

                    const res5 = await axios.get(url + "/subject/getcheckstatus");
                    if (res5.status === 200) {
                        sethandlecheckstatus(res5.data);
                    }

                    const res3 = await axios.get(url + "/subject/getstudentsubject/" + res2.data.id);
                    if (res3.status === 200) {
                        const mapstudentcheck = res3.data.map((e:studentType,i:number) => {
                            return({name:e.name,lastname:e.lastname,student_id:e.studentid,studentid:e.id,lavelid:res2.data.id,subjectid:res.data.id,checkid:5});
                        });
                        
                        setstudentcheck(mapstudentcheck);
                        sethandlestudent(res3.data);
                    }

                    const res4 = await axios.get(url + "/subject/getdatecount/" + param.subjectid);
                    
                    if (res4.data.length > 0) {
                        const res6 = await axios.get(`${url}/subject/gethistory/${res2.data.id}/${param.subjectid}`);
                        if (res.status === 200) {
                            if (res3.data.length > res6.data[0].records.length) {
                                const arrnew = res3.data.filter((student:any) => {
                                    return(!res6.data[0].records.some((record:any) => record.studentid === student.id));
                                }).map((newstudent:any) => {
                                    return({studentid:newstudent.id,lavelid:res2.data.id,subjectid:res.data.id,checkid:5});
                                });
                                const alldateid = res6.data.map((e:any) => e.records).map((g:any) => g[0].datecount.id);
                                const newstudent:any = [];
                                arrnew.forEach((e:any) => {
                                    alldateid.forEach((g:any) => {
                                        newstudent.push({studentid:e.studentid,lavelid:e.lavelid,subjectid:e.subjectid,datecountid:g,checkid:e.checkid});
                                    });
                                });

                                const createnewstory = await axios.post(url + "/subject/createnewstudenthistory",{data:newstudent});
                                const gethistory = await axios.get(`${url}/subject/gethistory/${res2.data.id}/${param.subjectid}`);
                                sethandlehistory([...gethistory.data]);
                            }
                            else {
                                sethandlehistory([...res6.data]);
                            }
                            
                            setiscansave(!(moment().format("DD-MM-YYYY") === res6.data[res6.data.length - 1].date))
                        }
                    }
                    else {
                        setiscansave(true);
                    }
                }
            }
            catch(err) {}
        }

        loadData();
    },[])

    //!

    //!open camera

    const openCamera = () => {
        setisopencamera((prev) => !prev);
    }

    //!

    //!select status

    const selectStatus = (value:string,index:number) => {
        const clonestudentcheck = [...studentcheck];

        clonestudentcheck[index].checkid = parseInt(value);

        const save = studentcheck.some((e) => {
            if (e.checkid === 1 || e.checkid === 2 || e.checkid === 3 || e.checkid === 4) {
                return(true);
            }
        });

        setissave(save);
        setstudentcheck([...clonestudentcheck]);
    }

    //!

    //!submit save data

    const save = async () => {
        try{
            const confirmsave = confirm(`บันทึกข้อมูลวันที่ ${datenow}`);

            if (confirmsave) {
                const res = await axios.post(url + "/subject/createhistory",{subjectid:param.subjectid,date:datenow,data:studentcheck});
                if (res.status === 201) {
                    const gethistory = await axios.get(`${url}/subject/gethistory/${handlelavel.id}/${param.subjectid}`);
                    sethandlehistory([...gethistory.data]);
                    setiscansave(!(moment().format("DD-MM-YYYY") === gethistory.data[gethistory.data.length - 1].date));
                    setissave(false);
                }
            }
        }
        catch(err) {}
    }

    //!

    //!update history

    const updateHistory = async (value:string,id:number) => {
        const update = await axios.patch(url + "/subject/updatehistory/" + id,{checkid:value});
        if (update.status === 200) {
            const gethistory = await axios.get(`${url}/subject/gethistory/${handlelavel.id}/${param.subjectid}`);
            if (gethistory.status === 200) {
                sethandlehistory([...gethistory.data]);
            }
        }
    }

    //!

    return(
        <div>
            <div className="fixed top-[0] flex justify-between w-[100%] p-[20px_50px_0_0] bg-[#000]">
                <p className="text-[20px] font-bold">ระบบเช็คชื่อ นักเรียนชั้น ม.{handlelavel.lavel}/{handlelavel.sublavel} วิชา {handlesubjectname.subjectname}</p>
                <div className="flex gap-[10px]">
                    {iscansave ? 
                        (issave ?  
                            <div onClick={() => save()} className="bg-white p-[2px_1rem] rounded-2xl text-[#000] cursor-pointer w-[65px]">
                                <p className="text-center">บันทึก</p>
                            </div>
                            :
                            ""
                        )
                        :
                        ""
                    }
                    <div onClick={() => openCamera()} className="bg-white p-[2px_1rem] rounded-2xl text-[#000] cursor-pointer w-[65px]">
                        <p className="text-center">{isopencamera ? "ปิด":"สแกน"}</p>
                    </div>
                </div>
            </div>
            {isopencamera ? 
                <Camera studentcheck={studentcheck} setstudentcheck={setstudentcheck} checksuccess={checksuccess} setchecksuccess={setchecksuccess} setissave={setissave} />
                :
                ""
            }
            <div className="mt-[20px] grid grid-cols-2 pt-[25px]">
                <div className="pt-[25px]">
                    <div className="grid grid-cols-4 text-center">
                        <p>ลำดับ</p>
                        <p>รหัสนักเรียน</p>
                        <p>ชื่อ</p>
                        <p>นามสกุล</p>
                    </div>
                    <div>
                        {handlestudent.map((e,i) => (
                            <div key={i} className="grid grid-cols-4 text-center mt-[10px] border border-gray-700">
                                <p>{i + 1}</p>
                                <p>{e.studentid}</p>
                                <p>{e.name}</p>
                                <p>{e.lastname}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex overflow-x-scroll pt-[25px]">
                    {handlehistory.map((e:any,i:number) => (
                        <div key={i} className="w-[100px] text-center ml-[10px] border border-gray-700 relative">
                            <p className="absolute top-[-25px] left-[50%] translate-x-[-50%] text-[15px]">{e.checkamount}/{e.records.length}</p>
                            <div>
                                <p>{e.date}</p>
                                {e.records.map((g:any,j:number) => (
                                    <div key={j} className="mt-[10px] border border-gray-700">
                                        <select onChange={(value) => updateHistory(value.target.value,g.id)} value={g.checkstatusid} className={`${g.checkstatusid === 1 ? "bg-green-600": g.checkstatusid === 2 ? "bg-red-600":g.checkstatusid === 3 ? "bg-yellow-600":g.checkstatusid === 4 ? "bg-blue-600":"bg-[#000]"} focus:outline-none text-center bg-[#000]`}> 
                                            {handlecheckstatus.map((h,k) => (
                                                <option key={k} value={h.id}>{h.statusname}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {iscansave ? 
                        <div className="w-[100px] text-center ml-[10px] border border-gray-700">
                            <div>
                                <p className="text-yellow-500">{datenow}</p>
                            </div>
                            {studentcheck.map((e,i) => (
                                <div key={i} className="mt-[10px] border border-gray-700">
                                    <select onChange={(e) => selectStatus(e.target.value,i)} value={e.checkid} className={`${e.checkid === 1 ? "bg-green-600": e.checkid === 2 ? "bg-red-600":e.checkid === 3 ? "bg-yellow-600":e.checkid === 4 ? "bg-blue-600":"bg-[#000]"} focus:outline-none text-center bg-[#000]`}> 
                                        {handlecheckstatus.map((e,i) => (
                                            <option key={i} value={e.id}>{e.statusname}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        :
                        ""
                    }
                </div>
            </div>
        </div>
    );
}