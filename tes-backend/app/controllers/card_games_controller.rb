class CardGamesController < ApplicationController
   def index
    @card_games = CardGame.all
    render :json => @card_games
   end

   def show
    @card_game = CardGame.find(params[:id])
    render :json => @card_game
   end
end

