from initial_conditions import *
from orbits import *

# #call ChangetoIC(Ndim,y)		!changing to centre of mass frame
# time = 0.0
# dt=0.000001*yr
#
# open(1,file='data.dat')
# do
# if (time>150) then		!for 2 orbital periods
# exit
# endif
# call RK4(Ndim,y,t,dt)
# y=y+f*dt
# time=time+dt
# write(1,*) y/AU

def calculate_initial_y_component_of_position_of_astral_body(body1, body2):
    body1.position[1] = ((G*(body1.mass+body2.mass))/.position[0])**0.5


def calculate_distance_between_astral_bodies(body1, body2):
    distance = ((body1.position[0]-body2.position[0])**2+(body1.position[1]-body2.position[1])**2+(body1.position[2]-body2.position[2])**2)**0.5
    return distance


def calculate_force_exerted_on_astral_bodies(body1, body2):
    for i in range(0, 2):
        body1.force[i] = G*(body1.force[i] + body1.mass*(body1.position[i]-body2.position[i])/(calculate_distance_between_astral_bodies(body1, body2))**3)

def execute_runge_kutta_integration(body1, body2, dt):
    h = 0.5*dt

    p1new = body1.position*(1 + dt) + 0.5*(dt**2)*body1.velocity
    p2new = body2.position*(1 + dt) + 0.5*(dt**2)*body1.velocity

    y3 = body1.velocity
    f1v1 = calculate_force_exerted_on_astral_bodies(body1, body2)
    f2v1 = body1.velocity + h*calculate_force_exerted_on_astral_bodies(body1, body2)
    f3v1 = body1.velocity + h*calculate_force_exerted_on_astral_bodies(body1, body2)
    f4v1 = body1.velocity + dt*calculate_force_exerted_on_astral_bodies(body1, body2)

    v1new = y3 + (f1v1 + 2*f2v1 + 2*f3v1 + f4v1)*dt/6

    y4 = body2.velocity
    f1v2 = calculate_force_exerted_on_astral_bodies(body2, body1)
    f2v2 = body2.velocity + h*calculate_force_exerted_on_astral_bodies(body2, body1)
    f3v2 = body2.velocity + h*calculate_force_exerted_on_astral_bodies(body2, body1)
    f4v2 = body2.velocity + dt*calculate_force_exerted_on_astral_bodies(body2, body1)

    v2new = y4 + (f1v2 + 2*f2v2 + 2*f3v2 + f4v2)*dt/6

    print p1new
    print p2new
    print v1new
    print v2new



# !----------------------------------------------------------------------------
# Subroutine RK4(Ndim,y,t,dt)
# !----------------------------------------------------------------------------
# ! ***  fourth-order Runge-Kutta integrator                                ***
# !----------------------------------------------------------------------------
# use constants
# implicit none
# integer,intent(in) :: Ndim           ! the dimension of the ODE system
# real*8,intent(inout) :: y(Ndim)      ! the solution vector at t, y(t)
# ! on return, it contains y(t+dt)
# real*8,intent(in) :: t,dt         ! time t, and time step to be integrated
# real*8 :: h                          ! half time step
# real*8,dimension(Ndim) :: f1, f2, f3, f4, ytmp1, ytmp2, ytmp3
#
# h=0.5d0*dt
#
# call RHS(Ndim, y, t, f1)             ! calulate f(y,t)
# ytmp1 = y + h*f1                     ! half step
#
# call RHS(Ndim, ytmp1, t+h, f2)       ! calculate f(ytmp1,t+h)
# ytmp2 = y + h*f2                     ! half step in another way
#
# call RHS(Ndim, ytmp2, t+h, f3)       ! calculate f(ytmp2,t+h)
# ytmp3 = y + dt*f3                 ! full step
#
# call RHS(Ndim, ytmp3, t+dt, f4)   ! calculate f(ytmp3,t+tstep)
#
# y = y + (f1 + 2.d0*f2 + 2.d0*f3 + f4)*dt/6.d0    ! Runge-Kutta recipe
#