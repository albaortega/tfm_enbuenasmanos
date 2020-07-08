export class UserInfo{
	public name: string;
    public email: string;
    public picture: string;
    public emailVerified: boolean;
    public admin: boolean;
    public catering: boolean;
    public worker: boolean;
    public language: string;
    public receive_mails: boolean;
    constructor(){
    	this.name = '';
        this.email = '';
        this.picture = '';
        this.emailVerified = false;
        this.admin = true;
        this.catering = true;
        this.worker = true;
        this.language = 'ca';
        this.receive_mails = true;
    }
}

export class User{
    public id: string;
    public name: string;
    public email: string;
    public dni: string;
    public worker: boolean;
    public user: boolean;
    public admin: boolean;
    public language: string;
    public picture : string;
    constructor(){
        this.name = '';
        this.name = '';
        this.email = '';
        this.dni = '';
        this.worker = false;
        this.user = true;
        this.admin = false;
        this.language = 'es';
        this.picture = '';
    }
}

export class Phone{
    public number: string;
    public user: string;
    constructor() {
        this.number = '';
        this.user = '';
    }
}

export class Person{
    public id: number;
    public client: string;
    public name: string;
    public age: number;
    public dependence: number;
    public disability: number;
    public desc_disability: string;
    public pattern: string;
    public observations: string;
    public type: number;
    constructor(){
        this.id = 0;
        this.client = '';
        this.name =  '';
        this.age= 0;
        this.dependence= 0;
        this.disability= 0;
        this.desc_disability= '';
        this.pattern= '';
        this.observations= '';
        this.type= 0;
    }
}

export class Address{
    public id: number;
    public client: string;
    public street: string;
    public number: number;
    public portal: string;
    public piso: string;
    public cp: string;
    public locality: string;
    public city: string;
    public country: string;
    public aditional: string;
    public address: string;
    public type: number;
    public floor: number;
    public room: number;
    constructor() {
        this.id = 0,
        this.client= '',
        this.street= '',
        this.number= 0,
        this.portal= '',
        this.piso= '',
        this.cp= '',
        this.locality= '',
        this.city= '',
        this.country= '',
        this.aditional= '',
        this.address= '',
        this.type = 0,
        this.floor = 0,
        this.room = 0
    }
}
