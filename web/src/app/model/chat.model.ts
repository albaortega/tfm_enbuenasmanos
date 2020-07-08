export class Chat{
    public id: string;
	public id_service: string;
	public client_id: string;
    public client_name: string;
    public client_picture: string;
    public worker_id: string;
    public worker_name: string;
    public worker_picture: string;
    constructor(){
        this.id = '';
    	this.id_service = '';
    	this.client_id = '';
        this.client_name = '';
        this.client_picture = '';
        this.worker_id = '';
        this.worker_name = '';
        this.worker_picture = '';
    }
}
