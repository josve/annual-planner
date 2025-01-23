import { MenuItem } from "@/types/MenuItem";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {Session} from "next-auth";

export function getMenuItems(session: Session): MenuItem[] {
    const items: MenuItem[] = [];

    items.push({
        name: "Hem",
        url: "/",
        icon: HomeOutlinedIcon,
    });

    return items;
}