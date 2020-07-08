import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ChatService} from './chat.service';
import {UserService} from "../../services/user.service";
import {User} from "../../model/user.model";
import {Chat} from "../../model/chat.model";
import {ChatsService} from "../../services/chats.service";
import {MessagesService} from "../../services/messages.service";
import {Message} from "../../model/message.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-chats',
  templateUrl: './app-chats.component.html',
  styleUrls: ['./app-chats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppChatsComponent implements OnInit {
  @ViewChild("msgForm") msgForm: NgForm;
  @ViewChild('chatsMessages', {read: ElementRef}) chatsMessages: ElementRef;
  public messagesCollection: Message[];
  public numMessages: number = 0;

  isSidenavOpen: Boolean = true;
  userInfo: User;
  public activeContact: User = new User();

  user;
  chats: Chat [];
  numChats: number = 0;
  activeChat: Chat = null;

  constructor(
    private mediaObserver: MediaObserver, 
    public chatService: ChatService,
    public userService: UserService,
    private chatsService: ChatsService,
    private messageService: MessagesService,
    private ElRef: ElementRef,
  ) {
    this.user = chatService.user
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(user=>{
      if(user) this.userInfo = user;
      this.loadChats();
    })
  }
   loadChats(){
    this.chatsService.getChats({filter:'client_id', value:this.userInfo.id}).subscribe((chats: Chat[])=>{
      this.chats = chats;
      this.numChats = this.chats.length;
    })
  }

  getChatByContact(chat: Chat){
    console.log(chat);
    let params = {id_chat: chat.id}
    this.messageService.getMessages(params).subscribe((messages: Message[])=>{

      this.messagesCollection = messages;
      this.numMessages = this.messagesCollection.length;
      this.activeChat = chat;
      document.getElementById('chatsMessages').scrollTop = document.getElementById('chatsMessages').scrollHeight;
    })
  }

  sendMessage() {
    let params = {
        id_chat: this.activeChat.id,
        from_user: this.userInfo.name,
        to_user: this.activeChat.worker_name,
        msg: this.msgForm.form.value.message
    };
    this.messageService.newMessage(params).subscribe(message=>{
      (document.getElementById('textmsg') as HTMLInputElement).value='';
      this.getChatByContact(this.activeChat);
    })
  }
}
