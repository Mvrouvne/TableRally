import json
from channels.generic.websocket import AsyncWebsocketConsumer
from queue import Queue
import time
import asyncio
from .models import pongames  
from asgiref.sync import sync_to_async
from authentication.models import CustomUser as User
from channels.db import database_sync_to_async
import time
import math

woiting_list = []
groups = []
GamePlay = []
main_player = []
second_player = False
acepted_users = []
games_map = {}
x = 0

def CreateGameName():
	global second_player, x
	if second_player == False :
		name =  "pair" + str(x)
		GamePlay.append(name)
		second_player = True
		return GamePlay[x]
	else :
		second_player = False
		x += 1
		return GamePlay[x - 1]


class Player:
	def __init__(self):
		self.y = 150
		self.speed = 5
	def Up(self):
		if self.y > 0:
			self.y -= self.speed

	def Down(self):
		if self.y < 280:
			self.y += self.speed

class Ball:
	def __init__(self):
		self.x = 350
		self.y = 150
		self.speed = 1
		self.angelx = 8
		self.angely = 4
	def IncrementX(self, stepx):
		self.x +=  stepx * self.speed * self.angelx
	def IncrementY(self,stepy):
		self.y += stepy * self.speed * self.angely

class LiveGame:
	def __init__(self):
		self.player1 = Player()
		self.player2 = Player()
		self.ball = Ball()
		self.score1 = 0
		self.score2 = 0
		self.stepx = 1
		self.stepy = 1
	def RunGame(self):
		if self.ball.x >= 680 and self.ball.y > self.player2.y  and self.ball.y < self.player2.y + 65:
			if self.ball.y > self.player2.y / 2:
				self.ball.angelx -= 0.2
				self.ball.angely += 0.2
			else:
				self.ball.angelx += 0.2
				self.ball.angely -= 0.2
			self.stepx *= -1
		elif self.ball.x  > 680 : 
			self.score1 += 1 
			self.ball.x = 350
			self.ball.y = 175
			self.player1.y = 150 
			self.player2.y = 150 
			return
		if self.ball.y > 340:
			self.stepy *= - 1
		if self.ball.x <= 20 and self.ball.y > self.player1.y - 5 and self.ball.y < self.player1.y + 65:
			if self.ball.y > self.player1.y / 2:
				self.ball.angelx -= 0.2
				self.ball.angely += 0.2
			else:
				self.ball.angelx += 0.2
				self.ball.angely -= 0.2
			self.stepx *= -1
		elif self.ball.x < 15:
			self.score2 += 1
			self.ball.x = 350
			self.ball.y = 175
			self.player1.y = 150 
			self.player2.y = 150 
			return
		if self.ball.y < 10:
			self.stepy *= - 1
		self.ball.IncrementX(self.stepx)
		self.ball.IncrementY(self.stepy)



class ChatConsumer(AsyncWebsocketConsumer):

	def __init__(self):
		super().__init__()
		self.index = 0
		self.me = 0
		self.other = 0
		self.ingame = False
		self.inwaiting = False
		self.waiter = False
		self.task = None

	async def connect(self):
		self.user = self.scope['user']
		if (self.user.id in acepted_users) == True:
			await self.close()
			return
		else :
			await self.accept()
			self.me = self.user.id
			acepted_users.append(self.me)
			await self.send(text_data=json.dumps({"TITLE": "wait", "image" : self.user.image_url}))
			await self.add_to_woiting_list()

	async def add_to_woiting_list(self):
		woiting_list.append(self.user.id)
		await self.match_players()

	async def match_players(self):
		if len(woiting_list) >= 2:
			woiting_list.remove(self.me)
			self.other = woiting_list.pop(0)
			self.index = self.serch_in_sublist(groups, self.other)
			self.group_name = groups[self.index][1]
			self.game = groups[self.index][2]
			main_player.append(self.me)
			await self.channel_layer.group_add(
				self.group_name,
				self.channel_name
			)
			self.ingame = True
			self.waiter = True
			await self.channel_layer.group_send(
			self.group_name,
			{
				"type" : "start",
				"group" : self.group_name,
				"TITLE" : "start",			
			}
			)

		else:
			self.game  = LiveGame()
			self.group_name = CreateGameName()
			groups.append([self.me ,CreateGameName(), self.game])
			await self.channel_layer.group_add(
				self.group_name,
				self.channel_name
			)
			self.inwaiting = True

	async def start(self, event):
		TITLE = event["TITLE"]
		await self.send(text_data=json.dumps({"TITLE": TITLE}))

	
	async def username_id(self, event):
		await self.send(text_data=json.dumps({"TITLE": event['TITLE'],
		"username" : event['username'], 
		"image" : event["image"],
		"id" : event["id"]}))

	async def receive(self, text_data):
		game = json.loads(text_data)
		if game["TITLE"] == "play" :
			await self.send(text_data=json.dumps({"TITLE": 'id',
			"id" : self.me}))
			games_map[self.group_name] = True
			self.inwaiting = False
			self.ingame = True
			if self.other == 0 :
				self.index = self.serch_in_sublist(groups, self.me)
				self.other = main_player[self.index]
			await self.channel_layer.group_send(
				self.group_name,
				{
					"type" : "username_id",
					"group" : self.group_name,
					"TITLE" : "username_id",
					"id" : self.user.id,
					"image" : self.user.image_url,
					"username" : self.user.username
				}
			)
			self.task = asyncio.create_task(self.GameLoop())
		if game["TITLE"] == "move_player":
			if game["player_direction"] == "up":
				if self.me < self.other:
					self.game.player1.Up()
				else :
					self.game.player2.Up()
			else :
				if self.me < self.other:
					self.game.player1.Down()
				else:
					self.game.player2.Down()

	async def disconnect(self, code):
		if self.group_name:
			games_map[self.group_name] = False
		await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
		acepted_users.remove(self.me)
		if self.inwaiting :
			groups.pop(self.serch_in_sublist(groups, self.me))
		elif self.inwaiting == False:
			ind = self.serch_in_sublist(groups, self.me)
			if ind != -1:
				groups.pop(ind)
		if self.ingame and self.waiter:
			main_player.remove(self.me)
		try:
			if self.me in woiting_list :
				woiting_list.remove(self.me)
		except ValueError as e:
				print(e)
						


	async def GameLoop(self):
		while True:
			if games_map[self.group_name] == False:
				if self.game.score1 != 3 and self.game.score2 != 3:
					await self.send(text_data=json.dumps({"TITLE": 'winner_send',
					"winner" : self.me}))
				break
			if self.me < self.other :
				self.game.RunGame()
				await self.channel_layer.group_send(
				self.group_name,
				{
					"type" : "loopsend",
					"group" : self.group_name,
					"TITLE" : "gameloop",
					"ballx" : self.game.ball.x,
					"bally" : self.game.ball.y,
					"player1" : self.game.player1.y,
					"player2" : self.game.player2.y,
					"score1" : self.game.score1,
					"score2" : self.game.score2,
				}
				)
				await asyncio.sleep(0.03)
				if self.game.score1  == 3 or self.game.score2 == 3:
					print(self.game.score1, "<<<<<<<")
					if self.game.score1 == 3:
						winner = self.me
					else :
						winner = self.other
					await self.create_score_entry()
					await self.channel_layer.group_send(
					self.group_name,
					{
						"type" : "winner_send",
						"group" : self.group_name,
						"TITLE" : "winner_send",
						"winner" : winner
					}
					)
					await asyncio.sleep(0.5)
					break
			else: 
				await asyncio.sleep(1)
		await self.close()
			
	async def winner_send(self, event):
		await self.send(text_data=json.dumps({"TITLE": event['TITLE'],
		"winner" : event['winner'],}))

	@sync_to_async
	def create_score_entry(self):
		print((User.objects.get)(id=self.other))
		pongames.objects.create(
			player1_id=(User.objects.get)(id=self.me),
			player2_id=(User.objects.get)(id=self.other),
			score1=self.game.score1,
			score2= self.game.score2
		)
		print("by database")

		
	async def loopsend(self, event):
		TITLE = event["TITLE"]
		ballx = event["ballx"]
		bally = event["bally"]
		player1 = event["player1"]
		player2 = event["player2"]
		score1 = event["score1"]
		score2 = event["score2"]

		await self.send(text_data=json.dumps({"TITLE": TITLE,
		"ballx" : ballx,
		"bally" : bally,
		"player1" : player1,
		"player2": player2,
		"score1" : score1,
		"score2" : score2}))
			

	def serch_in_sublist(self, mainlist,search_value):
		index = 0
		while index < len(mainlist):
			if mainlist[index][0] == search_value:
				return  index
			index += 1
		return -1