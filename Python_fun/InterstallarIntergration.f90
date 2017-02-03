
!----------------------------------------------------------------------------
Module Constants
!----------------------------------------------------------------------------
! ***  Constants used in the integration  ***
!----------------------------------------------------------------------------
  implicit none
  real*8::  AU= 1.5d10			!Astronomical unit
  real*8::  G= 6.67d-11			!Gravitational constant
  real*8::  pi= 3.14159265359d0
  real*8::  yr= 3.15569d7			!1 year in seconds
  real*8,save::  jyr= 37.4264834d7		!1 year in seconds on jupiter
  real*8::  Md= 3.844d7				!Distance from Earth to moon
  real*8,dimension(:),allocatable,save :: m	! allocatable mass
end Module Constants

!----------------------------------------------------------------------------
Program Starorbit
!----------------------------------------------------------------------------
! *** Main Program - Catriona Morrison /04/15 ***
!----------------------------------------------------------------------------
  use constants
  implicit none
  integer::i,N,Ndim,rk,jk,lk
  real*8::t,dt,time
  real*8::Etot,Eini,Etcon,Ekin,Ek,Ekcon,Epotin,Epot,Epcon
  real*8::Lz,Lzini,Lzcon
  real*8,dimension(:),allocatable :: f,y,tc

  N=3					!number of bodys
  Ndim=N*6				!length of vector
  allocate(y(Ndim),f(Ndim),tc(Ndim),m(N))

!----------------------------------------------------------------------------
! *** 3 or 2 body system ***
!----------------------------------------------------------------------------
    If (jk.eq.3) then
      call InitialConditionsSunMoon(Ndim,y)

    call ChangetoIC(Ndim,y)		!changing to centre of mass frame
    time=0.0d0				!intisalising time
    dt=0.000001*yr			!time step

    call Etotal(Ndim,y,Etot)
    Eini=Etot

    call angularmomentum(Ndim,y,Lz)
    Lzini=Lz
    open(1,file='data.dat')		!open file to save results to a data file
    open(4,file='conservationex3.dat')
!--------------------------Runge-Kutta integration------------------------------
    if (rk.eq.0) then
      do
	    if (time>0.05*yr) then		!for 2 orbital periods
	        exit
	    endif
	call RK4(Ndim,y,t,dt)
	y=y+f*dt
	time=time+dt
	write(1,*) y/AU
	call Etotal(Ndim,y,Etot)
	call angularmomentum(Ndim,y,Lz)
	Etcon=(Etot/Eini)-1.0d0
	Lzcon=(Lz/Lzini)-1.0d0
	write(4,*) Etcon,Lzcon
      enddo
!-----------------------Implicit Integration-------------------------------------------
    else
      do
	if (time>0.01*jyr) then		!for 2 orbital periods
	  exit
	endif
	call RHS(Ndim,y,t,f)
	y=y+f*dt
	time=time+dt
	write(1,*) y/AU
	call Etotal(Ndim,y,Etot)
	call angularmomentum(Ndim,y,Lz)
	Etcon=(Etot/Eini)-1.0d0
	Lzcon=(Lz/Lzini)-1.0d0
	write(4,*) Etcon,Lzcon
      enddo
    endif

!----------------------------------------------------------------------------
Subroutine ChangetoIC(Ndim,y)
!----------------------------------------------------------------------------
! *** changing initial conditions so that the sun stays central ***
!----------------------------------------------------------------------------
  use constants
  implicit none
  integer,intent(in) :: Ndim
  integer :: i
  real*8, dimension(Ndim),intent(inout):: y
  real*8 :: Mtot
  real*8,dimension(3) :: mr,mv,com,coms

  Mtot=0.0d0
  mr=0.0d0
  mv=0.0d0
  do i=1,Ndim/6
    Mtot= Mtot + m(i)
    mr= mr + m(i)*y(3*i-2:3*i)
    mv= mv + m(i)*y(Ndim/2+3*i-2:Ndim/2+3*i)
  enddo
  com=mr/Mtot
  coms=mv/Mtot

  do i=1,Ndim/6
    y(3*i-2:3*i)=y(3*i-2:3*i)-com(1:3)
    y(Ndim/2+3*i-2:Ndim/2+3*i)=y(Ndim/2+3*i-2:Ndim/2+3*i)-coms(1:3)
  enddo

end Subroutine ChangetoIC

!----------------------------------------------------------------------------
Subroutine RK4(Ndim,y,t,dt)
!----------------------------------------------------------------------------
! ***  fourth-order Runge-Kutta integrator                                ***
!----------------------------------------------------------------------------
  use constants
  implicit none
  integer,intent(in) :: Ndim           ! the dimension of the ODE system
  real*8,intent(inout) :: y(Ndim)      ! the solution vector at t, y(t)
                                       ! on return, it contains y(t+dt)
  real*8,intent(in) :: t,dt         ! time t, and time step to be integrated
  real*8 :: h                          ! half time step
  real*8,dimension(Ndim) :: f1, f2, f3, f4, ytmp1, ytmp2, ytmp3

  h=0.5d0*dt

  call RHS(Ndim, y, t, f1)             ! calulate f(y,t)
  ytmp1 = y + h*f1                     ! half step

  call RHS(Ndim, ytmp1, t+h, f2)       ! calculate f(ytmp1,t+h)
  ytmp2 = y + h*f2                     ! half step in another way

  call RHS(Ndim, ytmp2, t+h, f3)       ! calculate f(ytmp2,t+h)
  ytmp3 = y + dt*f3                 ! full step

  call RHS(Ndim, ytmp3, t+dt, f4)   ! calculate f(ytmp3,t+tstep)

  y = y + (f1 + 2.d0*f2 + 2.d0*f3 + f4)*dt/6.d0    ! Runge-Kutta recipe

end Subroutine RK4

