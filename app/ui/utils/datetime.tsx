import { format, isToday, isYesterday } from "date-fns";

export default function DateTime({ datetime, prefix }: { datetime: string | Date, prefix?: string }) {
    const formattedDate =
        isToday(new Date(datetime))
            ? format(new Date(datetime), "'Today', h:mm a")
            : isYesterday(new Date(datetime))
                ? format(new Date(datetime), "'Yesterday', h:mm a")
                : format(new Date(datetime), "yyyy-MM-dd, h:mm a")

    return <span>{prefix} {formattedDate}</span>;

}
