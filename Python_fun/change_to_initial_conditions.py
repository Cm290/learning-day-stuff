from initial_conditions import *

total_mass = 0.0
mr = 0.0
mv = 0.0
com = []
coms = []

for i in range(0, no_of_bodies-1):
    print(mass_arr[i])
    print(y_arr(i:no_of_bodies))
#     total_mass = total_mass + mass_arr[i]
#     mr = mr + mass_arr[i] * y_arr[3*i-2 : 3*i]
#     mv = mv + mass_arr[i] * y_arr[len_y/2+3*i-2:len_y/2+3*i]
#     com = mr/total_mass
#     coms = mv/total_mass
#
# for i in range(1,no_of_bodies):
#     y_arr[3*i-2:3*i] = y_arr[3*i-2:3*i]-com[1:3]
#     y_arr[len_y/2+3*i-2:len_y/2+3*i]=y[len_y/2+3*i-2:len_y/2+3*i]-coms[1:3]
#
