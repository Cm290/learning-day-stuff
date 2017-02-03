from constants import AU, G


class AstralBodies:

    def __init__(self, mass, position, velocity, force):
        self.mass = mass
        self.position = position
        self.velocity = velocity
        self.force = force


def calculate_initial_y_component_of_position_of_astral_body(body1, body2, body3):
    body1.position[1] = ((G*(body1.mass+body2.mass))/body3.position[0])**0.5


def calculate_distance_between_astral_bodies(body1, body2):
    distance = ((body1.position[0]-body2.position[0])**2+(body1.position[1]-body2.position[1])**2+(body1.position[2]-body2.position[2])**2)**0.5
    return distance


def calculate_force_exerted_on_astral_bodies(body1, body2):
    for i in range(0, 2):
        body1.force[i] = G*(body1.force[i] + body1.mass*(body1.position[i]-body2.position[i])/(calculate_distance_between_astral_bodies(body1, body2))**3)
        body2.force[i] = G*(body2.force[i] + body1.mass*(body2.position[i]-body1.position[i])/(calculate_distance_between_astral_bodies(body1, body2))**3)


