# playlist-preserver
saves your soundcloud playlists

# intro spiel
Have you ever been annoyed at soundcloud copyright takedowns? Ever create that perfect 50-track driving playlist only to find out weeks later that it had become 47 tracks long? Ever stared at your playlist trying to remenber what songs were removed, only to give up in frustration?

Now no longer will you have to accept 47 track long 50-track playlists! With playlist-preserver you will be able to clearly see what songs were added or removed by you, in addition to keeping track of song takedowns!  Give the middle finger to the man!

# what it does
This simple app allows you to save a playlist on your computer as raw text. Resubmitting your playlist (from text form) to this app highlights recent changes to your playlist, in addition to designating which songs were removed. It is recommended to update your playlist text file with this app as changes are made to your soundcloud playlist. 


note: This app does not require any login's and does not save your data. It will never change anything on soundcloud.

#getting started

required:

-a soundcloud api client ID

-a text editor


highly recommended:

-a soundcloud account





IMPORTANT: replace the 'YOURIDHERE' in line 2 of myScript.js with your soundcloud api clientID


1)Enter your soundcloud username into the textbox and click SEARCH.

2)Click on the desired username from the search results, this will bring up their playlists and an option for previous users to

update their playlist text file.

3)Click on a playlist to bring up the playlist in text form. Save this file to your computer.

4)As songs are added to your playlist or removed, resubmit your text file via the update option from step 2.

5)This will bring up a updated of your playlist, color coded according to changes made.

KEY:

Bold = recent changes

Crossed out = removed from playlist

Blue color = changes made by user

Orange color = changes (removals expecially) made by soundcloud


6)To save this update, press the Click Here to Save button. The updated playlist will be shown in text form. Save this file to your computer.

#closing notes
to see an example of this app in action, feel free to look at my own playlist:

1)enter shendude for the username

2)update playlist using the included playlist in the 'test.txt' file from the project folder

3) observe how Song1 (which was uploaded by yours truely and unceremonously takendown a mere 10min later) is shown in orange: signifying a takedown event. It is highlited in orange and bolded, showing its been takendown by soundcloud (acting on my behalf) and a recent event (test.txt was not updated to include this event)

4)if you save the updated playlist and resubmit it, no songs will be in bold, signifying that there were no changes made to the playlist since the last save.
