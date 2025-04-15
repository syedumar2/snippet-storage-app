
import { Button } from "./ui/button";

const Pagination = ({totalPages,setCurrentPage}) => {
    
    let pages = [];
    for(let i = 1; i<=totalPages;i++){
        pages.push(i);
    }
  return (
    <div className="flex gap-2">
        {
        pages.map((page,index) => { 
            //  this is like saying for page in pages
            return <Button className={"hover:cursor-pointer"} onClick={()=>setCurrentPage(page)} key={index}>{page}</Button>;
        })
        }
    </div>
  )
}

export default Pagination