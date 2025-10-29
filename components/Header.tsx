import Link from "next/link";

export default function Header() {
    return(
        <div className="border-b border-gray-600">
            <div className="text-[20px]">
                <Link href={"/addclassroom"}>เพิ่มชั้นเรียน</Link>
                <Link className="ml-[20px]" href={"/addsubjectroom"}>เพิ่มห้องเรียน</Link>
            </div>
        </div>
    );
}