import {Address, Person, User} from "./user.model";
import {Worker} from "./worker.model"

export class Service{
	public client: string;
    public phone: string;
    public user: string;
    public address: string;
    public start_date: Date;
    public end_date: Date;
    public open_end_date: boolean;
    public status: string;
    public id: string;
    public worker: string;
    public type: string;
    public address_details: Address;
    public user_details: Person;
    public worker_details: Worker;
    public client_details: User;
    public occupation_type: string;
    public schedule;
    constructor() {
        this.client = '';
        this.phone = '';
        this.user = '';
        this.address = '';
        this.start_date = new Date();
        this.end_date = new Date();
        this.open_end_date = false;
        this.status = 'pending';
        this.id = '';
        this.worker = '';
        this.type = '';
        this.address_details = new Address();
        this.user_details = new Person();
        this.client_details = new User();
        this.worker_details = new Worker();
        this.occupation_type = '';
        this.schedule = null;
    }

}
