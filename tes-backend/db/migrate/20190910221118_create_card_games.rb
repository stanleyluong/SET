class CreateCardGames < ActiveRecord::Migration[5.2]
  def change
    create_table :card_games do |t|
      t.integer :c1
      t.integer :c2
      t.integer :c3
      t.integer :gameId

      t.timestamps
    end
  end
end
