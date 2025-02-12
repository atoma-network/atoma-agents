import { Router } from 'express';
import ConversationController from '../../controllers/conversation.controller';

const conversationRouter: Router = Router();
const controller = new ConversationController();

// Start a new conversation
conversationRouter.post('/new', controller.startConversation);
// Send a message in a conversation
conversationRouter.post('/:conversationId/messages', controller.sendMessage);
// Get a specific conversation with its messages
conversationRouter.get('/:conversationId', controller.getConversation);
// Get all conversations for a user
conversationRouter.get('/user/:walletAddress', controller.getUserConversations);
//get all user conversation Ids
conversationRouter.get('/user/:walletAddress/id', controller.getUserConversationIds);
//delete conversation by Id;
conversationRouter.delete('/:conversationId/remove', controller.deleteUserConversations);

export default conversationRouter;
