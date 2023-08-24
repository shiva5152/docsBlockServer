export default (date:string)=>{
    const dateStr = date?.slice(2); // Removing the 'D:' prefix
    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10) - 1; // Months are 0-based (0=January, 1=February, etc.)
    const day = parseInt(dateStr.slice(6, 8), 10);
    const hour = parseInt(dateStr.slice(8, 10), 10);
    const minute = parseInt(dateStr.slice(10, 12), 10);
    const second = parseInt(dateStr.slice(12, 14), 10);
  
    const creationDate = new Date(year, month, day, hour, minute, second);
    return creationDate
}