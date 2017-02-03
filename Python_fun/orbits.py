from initial_conditions import *
from constants import yr
# from runge_kutta_integration import *

sun = AstralBodies(1.989*10**30, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0])
earth = AstralBodies(5.972*10**24, [AU, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0])

calculate_initial_y_component_of_position_of_astral_body(sun, earth, earth)
calculate_initial_y_component_of_position_of_astral_body(earth, sun, earth)

time = 0.0
dt = 1.0**(-4)*yr


def execute_runge_kutta_integration(body1, body2, dt):
    h = 0.5*dt
    y1 = body1.position
    y2 = body2.position
    y3 = body1.velocity
    y4 = body2.velocity

    f1p1 = body1.velocity
    f1p2 = body2.velocity
    f1v1 = calculate_force_exerted_on_astral_bodies(body1, body2)
    f1v2 = calculate_force_exerted_on_astral_bodies(body1, body2)

    f2p1 = body1.position + h*body1.velocity
    f2p2 = body2.position + h*body2.velocity
    f2v1 = body1.velocity + h*calculate_force_exerted_on_astral_bodies(body1, body2)
    f2v2 = body2.velocity + h*calculate_force_exerted_on_astral_bodies(body1, body2)

    f3p1 = body1.position + h*body1.velocity
    f3p2 = body2.position + h*body2.velocity
    f3v1 = body1.velocity + h*calculate_force_exerted_on_astral_bodies(body1, body2)
    f3v2 = body2.velocity + h*calculate_force_exerted_on_astral_bodies(body1, body2)

    f4p1 = body1.position + dt*body1.velocity
    f4p2 = body2.position + dt*body2.velocity
    f4v1 = body1.velocity + dt*calculate_force_exerted_on_astral_bodies(body1, body2)
    f4v2 = body2.velocity + dt*calculate_force_exerted_on_astral_bodies(body1, body2)

    p1new = y1 + (f1p1 + 2*f2p1 + 2*f3p1 + f4p1)*dt/6
    p2new = y2 + (f1p2 + 2*f2p2 + 2*f3p2 + f4p2)*dt/6
    v1new = y3 + (f1v1 + 2*f2v1 + 2*f3v1 + f4v1)*dt/6
    v2new = y4 + (f1v2 + 2*f2v2 + 2*f3v2 + f4v2)*dt/6

    print p1new
    print p2new
    print v1new
    print v2new

execute_runge_kutta_integration(sun, earth, dt)
