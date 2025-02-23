import { Theme } from "../view/style/ThemeManager";

interface UserData {
    name: string;
}

class UserService {
    data: UserData
    constructor() {}
}

const userService = new UserService();
export default userService;