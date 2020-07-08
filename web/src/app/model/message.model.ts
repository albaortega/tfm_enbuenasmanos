export class Message{
    public id: string;
	public id_chat: string;
	public date: Date;
    public from_user: string;
    public to_user: string;
    public msg: string;
    constructor(){
        this.id = '';
    	this.id_chat = '';
    	this.date = new Date();
        this.from_user = '';
        this.to_user = '';
        this.msg = '';
    }
}
