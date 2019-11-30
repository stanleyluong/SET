class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.string :img
      t.string :color
      t.string :shape
      t.string :shading
      t.string :number

      t.timestamps
    end
  end
end
