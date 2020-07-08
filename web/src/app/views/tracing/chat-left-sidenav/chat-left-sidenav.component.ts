import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ChatService } from "../chat.service";
import { Subscription } from "rxjs";
import {UserService} from "../../../services/user.service";
import {ChatsService} from "../../../services/chats.service";
import {Chat} from "../../../model/chat.model";
import {User} from "../../../model/user.model";

@Component({
  selector: "app-chat-left-sidenav",
  templateUrl: "./chat-left-sidenav.component.html",
  styleUrls: ["./chat-left-sidenav.component.scss"]
})
export class ChatLeftSidenavComponent implements OnInit {
  userUpdateSub: Subscription;
  loadDataSub: Subscription;

  isSidenavOpen = true;

  //currentUser: User = new User();
  contacts: any[];
  userInfo: User;

  chats: Chat [];

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private chatsService: ChatsService
  ) {}

  ngOnInit() {
    // this.chatService.onChatsUpdated
    //   .subscribe(updatedChats => {
    //     this.chats = updatedChats;
    //   });

    this.userService.currentUser.subscribe(user=>{
      if(user) this.userInfo = user;
      this.loadChats();
    })
    /*this.userUpdateSub = this.chatService.onUserUpdated
      .subscribe(updatedUser => {
        this.currentUser = updatedUser;
      });

    this.loadDataSub = this.chatService.loadChatData()
      .subscribe(res => {
        this.currentUser = this.chatService.user;
        // this.chats = this.chatService.chats;
        this.contacts = this.chatService.contacts;

        this.cdr.markForCheck();
      });*/
  }

  loadChats(){
    this.chatsService.getChats({filter:'client_id', value:this.userInfo.id}).subscribe((chats: Chat[])=>{
      this.chats = chats;
      console.log(this.chats);
    })
  }
  ngOnDestroy() {
    if( this.userUpdateSub ) this.userUpdateSub.unsubscribe();
    if( this.loadDataSub ) this.loadDataSub.unsubscribe();
  }

  getChatByContact(contactId) { 
    this.chatService.getChatByContact(contactId)
      .subscribe(res => {
        // console.log('from sub',res);
      }, err => {
        console.log(err)
      })
  }
  
}
