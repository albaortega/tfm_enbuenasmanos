import { User } from "./user.model";

export class Worker{
	public email: string;
    public phone: string;
    public status: string;
    public free: boolean;
    public incorporation_date: Date;
    public final_date: Date;
    public user_details: User;
    public name: string;
    public dni: string;
    public type: string;
    public picture: string;
    public accept_more_services: boolean;
    constructor(){
    	this.email = '';
        this.phone = '';
        this.status = '';
        this.free = true;
        this.incorporation_date = new Date();
        this.final_date = new Date();
        this.user_details = new User();
        this.name = this.user_details.name;
        this.dni = this.user_details.dni;
        this.picture = this.user_details.picture;
        this.type = '';
        this.accept_more_services = false;
    }
}
