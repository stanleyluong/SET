class UsersController < ApplicationController

    def index
        @users = User.all
        render :json => @users
       end
    
    def show
        @user = User.find(params[:id])
        render :json => @user
    end

    def create
        @user = User.new(user_params)
        @user.name = User.name
        @user.save
        render json => @user
    end

    def delete
        @user = User.find(params[:id])
        @user.destroy
    end

    private

    def user_params
        params.require(:user).permit(:name => {})
    end
 

end
