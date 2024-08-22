import { format, isToday, isYesterday } from "date-fns";

export default function DateTime({ datetime }: { datetime: string }) {
    const formattedDate =
        isToday(new Date(datetime))
            ? format(new Date(datetime), "'Today', h.mmaaa")
            : isYesterday(new Date(datetime))
                ? format(new Date(datetime), "'Yesterday', h.mmaaa")
                : format(new Date(datetime), "do MMM yyyy, h.mmaaa")

    return <span>{formattedDate}</span>;

}
