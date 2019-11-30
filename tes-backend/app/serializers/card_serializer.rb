class CardSerializer < ActiveModel::Serializer
  attributes :id, :img, :color, :shape, :shading, :number
end
